import React from 'react';
import {IconButton} from 'react-native-paper';

const MyIconBtn = props => {
  return (
    <IconButton
      icon={props.icon}
      iconColor={props.iconColor}
      containerColor={props.containerColor}
      animated={props.animated}
      size={props.size}
      onPress={props.onPress}
      mode={props.mode}
      accessibilityLabel={props.accessibilityLabel}
      style={props.style}
    />
  );
};

export default MyIconBtn;
