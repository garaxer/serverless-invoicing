"use client";
const Emailer = ({ sendEmail }: { sendEmail: () => Promise<boolean> }) => {
  return (
    <form action={sendEmail}>
      <button type="submit" className="btn">
        Send Email
      </button>
    </form>
  );
};

export default Emailer;
