export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success)
      return res
        .status(400)
        .json({ error: { code: 'INVALID_INPUT', message: 'Revisa los datos ingresados' } })
    req.body = result.data
    next()
  }
}
