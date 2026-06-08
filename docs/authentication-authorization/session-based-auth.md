# This one = SESSION BASED AUTH

```js
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account doesn't exist",
      });
    }

    // 2. Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 3. Create session token
    const token = crypto.randomBytes(32).toString("hex");

    // 4. Save session in DB
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 5. Send cookie
    res.cookie("session", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = login;
```

---

```js
const token = crypto.randomBytes(32).toString("hex");

await prisma.session.create({
  data: {
    token,
    userId: user.id,
    expiresAt: ...
  }
});
```

### Flow:

```text
Login
 ↓
Random token created
 ↓
Saved in database (session table)
 ↓
Cookie sent to browser
 ↓
Every request → DB check
```

### Key point:

Server stores session in DB

---
