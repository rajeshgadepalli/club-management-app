import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '@/hooks/api/useAuth';
import { appStyles } from '@/theme/styles.new';

type LoginScreenProps = {
  onLogin: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <View style={[appStyles.containerFluid, appStyles.center]}>
      <View style={[appStyles.card, appStyles.gap, { width: '90%' }]}>
        <View style={appStyles.center}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=200&h=200'
            }}
            style={styles.logo}
          />
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          SalesPro Hub
        </Text>

        <View style={appStyles.gap}>
          <View>
            <TextInput
              label="Mobile No"
              value={username}
              keyboardType="numeric"
              onChangeText={setUsername}
              contentStyle={{ letterSpacing: 4 }}
              error={!!error?.errors?.username}
              disabled={isLoading}
            />
            {error?.errors?.username && (
              <HelperText type="error">{error.errors.username[0]}</HelperText>
            )}
          </View>

          <View>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={!!error?.errors?.password}
              disabled={isLoading}
            />
            {error?.errors?.password && (
              <HelperText type="error">{error.errors.password[0]}</HelperText>
            )}
          </View>

          {error && !error.errors && (
            <HelperText type="error">
              {error.message}
            </HelperText>
          )}

          <View>
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>

            <Button
              mode="text"
              onPress={() => { }}
              disabled={isLoading}
            >
              Forgot Password
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 100,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  title: {
    textAlign: 'center',
    marginBottom: 24
  }
});

export default LoginScreen;
