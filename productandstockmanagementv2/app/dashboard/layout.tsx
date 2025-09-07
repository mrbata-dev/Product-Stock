import SideBar from '@/components/ui/custom/SideBar';
import React, { ReactNode } from 'react';

type DashBoardLayoutProps = {
  children: ReactNode;
};

const DashBoardLayout = ({ children }: DashBoardLayoutProps) => {

  return <main className='flex'>
    {/* sidebar */}
    <div className='bg-white '>
      <SideBar/>
    </div>
    {children}
    </main>;
};

export default DashBoardLayout;
