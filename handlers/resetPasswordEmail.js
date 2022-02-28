const config = require('../config/config');

module.exports = resetPasswordTemplate = (user) => {
  const url = `${config.server.front_hostname}/reset-password/${user.token}`;
  const emailTemplate = {
    user,
    subject: 'Get Party: Reset Password',
    html: `
        <table style="background-color: #f6f7fb; width: 100%">
        <tbody>
          <tr>
            <td>
              <table style="width: 650px; margin: 0 auto; margin-bottom: 30px">
                <tbody>
                  <tr>
                    <td><img src="" alt=""></td>
                  </tr>
                </tbody>
              </table>
              <table style="display: flex; width: 650px; margin: 0 auto; background-color: #fff; border-radius: 8px">
                <tbody>
                  <tr>
                    <td style="padding: 30px">
                    <h1 style="
                    font-family: Poppins, sans-serif;
                    color: #FEBE3E;
                    font-weight: bolder;
                    "> 
                    Welcome to Get Party!
                    </h1> 
                    <p style="font-family: Poppins, sans-serif;">Click, "Reset Password" to reset your password. </p>
                    <div class="text-center">
                      <a href="${url}" style="padding: 10px; background-color: #FD991B; color: #fff; display: inline-block; border-radius: 4px; margin-bottom: 18px; text-decoration: none; font-family: Poppins, sans-serif;">
                        Reset Password
                      </a>
                    </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 650px; margin: 0 auto; margin-top: 30px">
                <tbody>       
                  <tr style="text-align: center">
                    <td> 
                      <p style="color: #999; margin-bottom: 0; font-family: Poppins, sans-serif;">
                        Powered By Get Party!
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
            `,
  };

  return emailTemplate;
};
