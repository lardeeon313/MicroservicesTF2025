
// This component renders a navigation bar for the operator with a logo and user icon*/

import React from 'react';
import { View, Image,Text, TouchableOpacity } from 'react-native';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
//import NavbarDropdownMenuComponent from "./NavbarDropdownMenu";

interface NavbarProps {
  user: { name: string; role: string } | null;
  isAuthenticated: boolean;
  logout: () => void;
}



const NavbarOperator = ({ user, isAuthenticated, logout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: '#1f2937',paddingVertical: 12,paddingHorizontal: 16,flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
        <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap: 10}}
        onPress={() => navigation}>
            <Image source={require('../../../assetsImages/LogoVerona.png')} style={{width: 40,height: 40,marginRight: 8,resizeMode: 'contain'}}/>
            <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>Distribuidora verona</Text>
        </TouchableOpacity>

        {isAuthenticated && user && (
            <View style={{alignItems:'center',gap:10}}>
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                    <Image source={require('../../../assetsImages/icon-person.png')} style={{width: 40,height: 40,marginRight: 8,resizeMode: 'contain'}} />
                    <View>
                      <Text style={{color: '#ffffff', fontSize: 14, fontWeight: 'bold'}}>{user.name}</Text>
                      <Text style={{color: '#9ca3af', fontSize: 12, fontWeight:'bold'}}>{user.role}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );
};

export default NavbarOperator;