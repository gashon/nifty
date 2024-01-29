import Template from '../types/template';

const template: Template = {
  from: 'gashon@ghussein.org',
  subject: 'Log in to Nifty',
  content: `
    <div>
      Your login link for Nifty
      <br /><br />
      <a href="{{{ login_link }}}">Continue to Nifty</a>
      <br /><br />
      This link and code will only be valid for the next 5 minutes. If the link
      does not work, contact support at @Nifty.
    </div>
  `,
};

export default template;
