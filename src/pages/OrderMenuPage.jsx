import { MenuContext } from '@/contexts/menuContext'
import React from 'react'
import { useContext } from 'react'

export const OrderMenuPage = () => {

const {createOrderMenu} = useContext(MenuContext);
const responseOrderMenu = createOrderMenu();
console.log("responseOrderMenu", responseOrderMenu)

  return (
    <div>OrderMenu</div>
  )
}
