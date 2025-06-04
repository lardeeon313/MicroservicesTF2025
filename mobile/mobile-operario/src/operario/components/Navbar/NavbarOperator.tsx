
// This component renders a navigation bar for the operator with a logo and user icon*/

import React from 'react';
import { View, Image, StyleSheet,Text, TouchableOpacity } from 'react-native';
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
            <View style={{position: 'relative'}}>
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                    <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>{user.name}</Text>
                    <Text style={{color: '#9ca3af', fontSize: 14}}>{user.role}</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );
};

export default NavbarOperator;