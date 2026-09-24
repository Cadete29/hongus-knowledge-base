import { randomUUID } from 'node:crypto'
import { config } from '../config/env.js'
import { pool, transaction } from '../config/db.js'

const catalog = Object.freeze({
  student: {
    code: 'student',
    name: 'Estudiante',
    amountCents: 5000,
    currency: 'MXN',
    mentoringAllowance: 1,
  },
  professional: {
    code: 'professional',
    name: 'Inicio Profesional',
    amountCents: 20000,
    currency: 'MXN',
    mentoringAllowance: 4,
  },
})
const fail = (res, status, code, message) => res.status(status).json({ error: { code, message } })
const publicOrder = (row) => ({
  id: row.id,
  plan: row.plan_code,
  amountCents: row.amount_cents,
  currency: row.currency,
  status: row.status,
  createdAt: row.created_at,
})
const publicSubscription = (row) =>
  row
    ? {
        id: row.id,
        plan: row.plan_code,
        status: row.status,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        mentoringAllowance: row.mentoring_allowance,
        mentoringUsed: row.mentoring_used,
      }
    : null

async function currentSubscription(accountId, client = pool) {
  const { rows } = await client.query(
    "SELECT * FROM subscriptions WHERE account_id=$1 AND status='active' AND ends_at>now() ORDER BY ends_at DESC LIMIT 1",
    [accountId],
  )
  return rows[0] || null
}

export const plans = (_req, res) =>
  res.json({
    plans: Object.values(catalog).map(({ mentoringAllowance, ...plan }) => ({
      ...plan,
      mentoringAllowance,
    })),
  })

export const onboarding = async (req, res, next) => {
  try {
    const [{ rows: accountRows }, { rows: accreditationRows }, subscription] = await Promise.all([
      pool.query('SELECT name,email,account_type FROM accounts WHERE id=$1', [
        req.session.account_id,
      ]),
      pool.query(
        'SELECT status,valid_until FROM academic_accreditations WHERE account_id=$1 ORDER BY updated_at DESC LIMIT 1',
        [req.session.account_id],
      ),
      currentSubscription(req.session.account_id),
    ])
    const account = accountRows[0]
    res.json({
      account: { name: account.name, email: account.email, accountType: account.account_type },
      accreditation: accreditationRows[0] || null,
      subscription: publicSubscription(subscription),
      eligiblePlans:
        account.account_type === 'graduate'
          ? ['professional']
          : accreditationRows[0]?.status === 'approved'
            ? ['student']
            : [],
    })
  } catch (error) {
    next(error)
  }
}

export const createOrder = async (req, res, next) => {
  try {
    const plan = catalog[req.body.plan]
    const { rows: accountRows } = await pool.query(
      'SELECT account_type FROM accounts WHERE id=$1',
      [req.session.account_id],
    )
    const accountType = accountRows[0]?.account_type
    if (plan.code === 'professional' && accountType !== 'graduate')
      return fail(
        res,
        403,
        'PLAN_NOT_ELIGIBLE',
        'Este plan está disponible para egresados y profesionales sin experiencia',
      )
    if (plan.code === 'student') {
      const { rows } = await pool.query(
        "SELECT 1 FROM academic_accreditations WHERE account_id=$1 AND status='approved' AND (valid_until IS NULL OR valid_until>=CURRENT_DATE) LIMIT 1",
        [req.session.account_id],
      )
      if (!rows.length)
        return fail(res, 403, 'ACCREDITATION_REQUIRED', 'Primero debes acreditar tus estudios')
    }
    if (await currentSubscription(req.session.account_id))
      return fail(res, 409, 'SUBSCRIPTION_ACTIVE', 'Ya tienes un plan activo')
    const id = randomUUID()
    const { rows } = await pool.query(
      `INSERT INTO subscription_orders(id,account_id,plan_code,amount_cents,currency,status,idempotency_key)
      VALUES($1,$2,$3,$4,$5,'created',$6)
      ON CONFLICT(account_id,idempotency_key) DO UPDATE SET updated_at=subscription_orders.updated_at RETURNING *`,
      [
        id,
        req.session.account_id,
        plan.code,
        plan.amountCents,
        plan.currency,
        req.body.idempotencyKey,
      ],
    )
    res.status(201).json({
      order: publicOrder(rows[0]),
      checkoutMode: config.production ? 'unavailable' : 'simulated',
    })
  } catch (error) {
    next(error)
  }
}

export const getOrder = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM subscription_orders WHERE id=$1 AND account_id=$2',
      [req.params.orderId, req.session.account_id],
    )
    if (!rows.length) return fail(res, 404, 'ORDER_NOT_FOUND', 'Orden no encontrada')
    res.json({ order: publicOrder(rows[0]) })
  } catch (error) {
    next(error)
  }
}

export const simulateConfirmation = async (req, res, next) => {
  if (config.production) return fail(res, 404, 'NOT_FOUND', 'No disponible')
  try {
    const subscription = await transaction(async (client) => {
      const { rows } = await client.query(
        'SELECT * FROM subscription_orders WHERE id=$1 AND account_id=$2 FOR UPDATE',
        [req.params.orderId, req.session.account_id],
      )
      const order = rows[0]
      if (!order) return null
      if (order.status === 'confirmed') {
        const existing = await client.query('SELECT * FROM subscriptions WHERE order_id=$1', [
          order.id,
        ])
        return existing.rows[0]
      }
      if (order.status !== 'created' && order.status !== 'pending') return false
      const plan = catalog[order.plan_code]
      await client.query(
        "UPDATE subscription_orders SET status='confirmed',confirmed_at=now(),updated_at=now() WHERE id=$1",
        [order.id],
      )
      const { rows: subscriptions } = await client.query(
        `INSERT INTO subscriptions(id,account_id,order_id,plan_code,status,starts_at,ends_at,mentoring_allowance)
        VALUES($1,$2,$3,$4,'active',now(),now()+interval '1 month',$5) RETURNING *`,
        [randomUUID(), req.session.account_id, order.id, order.plan_code, plan.mentoringAllowance],
      )
      return subscriptions[0]
    })
    if (subscription === null) return fail(res, 404, 'ORDER_NOT_FOUND', 'Orden no encontrada')
    if (subscription === false)
      return fail(res, 409, 'ORDER_NOT_CONFIRMABLE', 'La orden no puede confirmarse')
    res.json({ subscription: publicSubscription(subscription) })
  } catch (error) {
    next(error)
  }
}
