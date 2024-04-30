import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon} from '@components';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTheme} from '@config';

export default function Index(props) {
  const {colors} = useTheme();
  const {style, image, title, subtitle, onPressMessenger, onPressPhone} = props;
  return (
    <View style={[styles.content, style]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={styles.icon} source={image} />
        <View style={{marginLeft: 8}}>
          <Text body1>{title}</Text>
          <Text footnote style={{marginTop: 4}}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={onPressMessenger}
          style={[
            styles.icon,
            {marginHorizontal: 16, backgroundColor: colors.primaryLight},
          ]}>
          <Icon name="facebook-messenger" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressPhone}
          style={[styles.icon, {backgroundColor: colors.primaryLight}]}>
          <Icon name="mobile-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPressMessenger: PropTypes.func,
  onPressPhone: PropTypes.func,
};

Index.defaultProps = {
  style: {},
  image: '',
  title: '',
  subtitle: '',
  onPressMessenger: () => {},
  onPressPhone: () => {},
};
