import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const API_BASE = 'http://192.168.18.79:3000/api';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setIsError(false);
    setIsSent(false);
    if (onClose) onClose();
  };

  const handleSendReset = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setMessage('Please enter your email address.');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch(`${API_BASE}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: trimmed }),
      });

      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      if (!res.ok) {
        const msg = (body && (body.message || body.error)) || 'Failed to send reset email';
        setMessage(msg);
        setIsError(true);
      } else {
        const msg = (body && body.message) || 'Password reset link sent. Check your email.';
        setMessage(msg);
        setIsError(false);
        setIsSent(true);
      }
    } catch (e) {
      setMessage('An error occurred. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={!!isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.cardWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a link to reset your password.
            </Text>

            {!isSent && (
              <>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="yourname@gmail.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </>
            )}

            {!!message && (
              <Text style={[styles.message, isError ? styles.error : styles.success]}>
                {message}
              </Text>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={isSent ? handleClose : handleSendReset}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryText}>
                  {isSent ? 'Back to Login' : 'Send Reset Link'}
                </Text>
              )}
            </TouchableOpacity>

            {!isSent && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleClose}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    marginBottom: 12,
  },
  error: {
    color: '#d9534f',
  },
  success: {
    color: '#28a745',
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ForgotPasswordModal;

