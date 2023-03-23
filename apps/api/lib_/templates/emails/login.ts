import Template from '../types/template';

const template: Template = {
  from: 'gashon@ghussein.org',
  subject: 'Log in to next-express',
  content: `
    <div>
      Your login link for Next-Express
      <br /><br />
      <a href="{{{ login_link }}}">Continue to Next-Express</a>
      <br /><br />
      This link and code will only be valid for the next 5 minutes. If the link
      does not work, contact support at @next-express-email.
    </div>
  `,
};

export default template;
