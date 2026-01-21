import React, { useContext } from 'react';
import { FormProps } from '@/utils/types';
import { StyleSheet, Text } from 'react-native';
import { ThemeContext } from '@/styles/ThemeProvider';
import RenderHTML from 'react-native-render-html';

export const NotParticipating = ({ state }: FormProps) => {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <>
      {/* <Text style={styles.desc}>{state.name} does not require voter registration, but you do need to have a valid forms of identification that can be used for voting, and on Election Day be at least 18 years of age and have lived in {state.name} for at least 30 days</Text> */}
      <RenderHTML
        source={{ html: state.not_participating_text || "" }}
        tagsStyles={{
          a: {
            color: theme.primary,
            textDecorationLine: "underline",
          },
        }}
      />
      <RenderHTML
        source={{ html: state.sos_address || "" }}
      />
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    desc: {
      marginBottom: 10,
    },
  });
