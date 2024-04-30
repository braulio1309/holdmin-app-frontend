import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {BaseColor} from '@config';
import {Text, Icon, Image} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import {Placeholder, Progressive, PlaceholderMedia} from 'rn-placeholder';
import {useTranslation} from 'react-i18next';

export default function CategoryFull(props) {
  const {t} = useTranslation();
  const {style, loading, image, icon, color, title, subtitle, onPress} = props;
  if (loading) {
    return (
      <Placeholder Animation={Progressive}>
        <View style={[styles.contain, style]}>
          <PlaceholderMedia style={styles.placehoder} />
        </View>
      </Placeholder>
    );
  }
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={styles.contentIcon}>
        <View style={[styles.iconCircle, {backgroundColor: '#558EF9'}]}>
          <Icon size={18} color={BaseColor.whiteColor} />
        </View>
        <View style={styles.contentTitle}>
          <Text headline bold >
            {title}
          </Text>
          <Text body2 bold >
            {subtitle} 
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

CategoryFull.defaultProps = {
  style: {},
  loading: false,
  image: '',
  icon: '',
  color: '',
  title: '',
  subtitle: '',
  onPress: () => {},
};
