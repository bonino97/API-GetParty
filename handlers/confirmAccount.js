const config = require('../config/config');

module.exports = confirmAccountTemplate = (user) => {
  const url = `${config.server.front_hostname}/confirm-account/${user.token}`;
  const emailTemplate = {
    user,
    subject: 'Get Party: Confirm Account',
    html: `
        <table style="background-color: #f6f7fb; width: 100%">
        <tbody>
          <tr>
            <td>
              <table style="width: 650px; margin: 0 auto; margin-bottom: 30px">
                <tbody>
                  <tr>
                    <td><img src="../assets/images/cuba-logo1.png" alt=""></td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 650px; margin: 0 auto; background-color: #fff; border-radius: 8px">
                <tbody>
                  <tr>
                    <td style="padding: 30px">
                    <h1 style="
                    font-family: Poppins, sans-serif;
                    color: #7366ff;
                    font-weight: bolder;
                    "> 
                    Recruiter Work!
                    </h1> 
                      <p style="font-family: Poppins, sans-serif;">Hi There,</p>
                      <p style="font-family: Poppins, sans-serif;">Thank you very much for joining us!</p>
                      <div class="text-center"><a href="${url}" style="padding: 10px; background-color: #7366ff; color: #fff; display: inline-block; border-radius: 4px; margin-bottom: 18px; font-family: Poppins, sans-serif;">CONFIRM ACCOUNT</a></div>
                      <p style="font-family: Poppins, sans-serif;">Please click Confirm Account. To validate your account.</p>
                      <p style="margin-bottom: 0; font-family: Poppins, sans-serif;">Good luck!</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 650px; margin: 0 auto; margin-top: 30px">
                <tbody>       
                  <tr style="text-align: center">
                    <td> 
                      <p style="color: #999; margin-bottom: 0; font-family: Poppins, sans-serif;">Powered By Get Party!</p>
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
