import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native'

import { AntDesign } from '@expo/vector-icons'

const MenuBtn = ({ handleOpen }) => {
    return (
        <TouchableOpacity
            className='rounded-full h-[55px] w-[55px] flex items-center justify-center bg-white border-[1px] border-gray-400 absolute bottom-3 right-3'
            onPress={handleOpen}
        >
            <AntDesign name='appstore-o' size={26} color='gray' />
        </TouchableOpacity>
    )
}

export default MenuBtn