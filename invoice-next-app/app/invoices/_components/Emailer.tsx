import { createEmailClient } from "../_libs/email";
import config from "../config";

const Emailer = () => {
  const handleClick = async () => {
    const emailer =  createEmailClient();
    emailer.send({
        to: [config.emailTo],
        from: { name: "Gary", email: config.emailFrom },
        subject: 'Invoice for rent',
        html: '<p>Test</p>'
      })
  };
  return (
    <button onClick={handleClick} className="btn">
      Send Email
    </button>
  );
};

export default Emailer;
