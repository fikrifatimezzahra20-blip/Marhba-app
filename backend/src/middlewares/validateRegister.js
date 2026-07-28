const validateRegister = (req, res, next) => {

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      error: "Invalid email",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters",
    });
  }

  next();
};

export default validateRegister;