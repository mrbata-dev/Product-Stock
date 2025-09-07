import React from 'react'

interface HeaderContentProps {
    title: string
}
const HeaderContent = ({title} : HeaderContentProps ) => {
  return (
    <div>
      <h1 className='text-heading-2'>{title}</h1>
    </div>
  )
}

export default HeaderContent
