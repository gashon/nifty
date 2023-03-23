import React from 'react';
import { Link, Button } from './elements';
// import Logo from '../common/logo';

export default function Navbar() {
  return (
    <div className="absolute top-0 inset-x-0 h-14 flex items-center border-b px-5">
      <div className="flex-1 flex items-center group">
        Post!
        <div>{/* <Logo width={25} height={25} className="group-hover:hidden" /> */}</div>
      </div>
      <div className="flex items-center"></div>
    </div>
  );
}
