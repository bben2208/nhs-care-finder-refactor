export const validate = (schema) => (req, _res, next) => {
    const parsed = schema.safeParse({ query: req.query, params: req.params, body: req.body });
    if (!parsed.success) {
        return next({ status: 400, message: "Invalid request", details: parsed.error.flatten() });
    }
    next();
};
