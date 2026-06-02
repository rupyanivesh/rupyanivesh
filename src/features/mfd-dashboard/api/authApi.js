const wait = (ms = 300) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const DEMO_USER = {
  username: 'admin@rupyanivesh.in',
  password: 'Admin@123',
  name: 'RupyaNivesh Admin',
};

const registeredUsers = new Map([[DEMO_USER.username, DEMO_USER]]);

export const authApi = {
  async signup({ fullName, email, password, confirmPassword }) {
    await wait();
    if (!fullName?.trim()) {
      throw new Error('Please enter full name.');
    }
    if (!email?.trim()) {
      throw new Error('Please enter email.');
    }
    if (!password) {
      throw new Error('Please enter password.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (registeredUsers.has(email)) {
      throw new Error('An account already exists with this email.');
    }

    registeredUsers.set(email, {
      username: email,
      password,
      name: fullName,
    });

    return {
      message: 'Account created successfully. Please sign in.',
    };
  },

  async login({ username, password }) {
    await wait();
    if (!username) {
      throw new Error('Please enter your username or email');
    }
    if (!password) {
      throw new Error('Please enter your password');
    }
    const user = registeredUsers.get(username);
    if (!user || user.password !== password) {
      throw new Error('Invalid username or password. Please try again.');
    }
    return { requiresOtp: true, otpRef: 'OTP-SESSION-REF' };
  },

  async verifyOtp({ otp }) {
    await wait();
    if (!otp) {
      throw new Error('Please enter OTP.');
    }
    if (otp !== '123456') {
      throw new Error('Invalid OTP. 2 attempts remaining.');
    }
    return {
      token: 'mfd_demo_token',
      user: { name: DEMO_USER.name, email: DEMO_USER.username },
    };
  },

  async requestPasswordReset({ email }) {
    await wait();
    if (!email) {
      throw new Error('Please enter registered email.');
    }
    return { message: 'Password reset link sent to your email.' };
  },
};
