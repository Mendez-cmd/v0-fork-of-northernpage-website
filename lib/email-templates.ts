export const confirmSignUpEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .logo {
      max-width: 150px;
      height: auto;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #D4AF37;
      color: #000000 !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      background-color: #C5A028;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #888;
      font-size: 12px;
      border-top: 1px solid #eee;
    }
    .code {
      display: inline-block;
      padding: 10px 20px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://northernchefs.com/logo.png" alt="Northern Chefs Logo" class="logo">
    </div>
    <div class="content">
      <h1>Confirm Your Email</h1>
      <p>Thank you for signing up with Northern Chefs! Please confirm your email address to activate your account.</p>
      <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email" class="button">Confirm Email Address</a>
      <p>If you didn't create an account with Northern Chefs, you can safely ignore this email.</p>
      <p>Alternatively, you can use this verification code:</p>
      <div class="code">{{ .Token }}</div>
    </div>
    <div class="footer">
      <p>&copy; 2025 Northern Chefs. All rights reserved.</p>
      <p>BLK Try Lot Try South, Caloocan, Philippines</p>
    </div>
  </div>
</body>
</html>
`

export const resetPasswordEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .logo {
      max-width: 150px;
      height: auto;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #D4AF37;
      color: #000000 !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      background-color: #C5A028;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #888;
      font-size: 12px;
      border-top: 1px solid #eee;
    }
    .code {
      display: inline-block;
      padding: 10px 20px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://northernchefs.com/logo.png" alt="Northern Chefs Logo" class="logo">
    </div>
    <div class="content">
      <h1>Reset Your Password</h1>
      <p>We received a request to reset your password for your Northern Chefs account. Click the button below to create a new password:</p>
      <a href="{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery" class="button">Reset Password</a>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Alternatively, you can use this reset code:</p>
      <div class="code">{{ .Token }}</div>
      <p>This link will expire in 24 hours.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Northern Chefs. All rights reserved.</p>
      <p>BLK Try Lot Try South, Caloocan, Philippines</p>
    </div>
  </div>
</body>
</html>
`
