import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Service, ServiceFormValues } from '../services/serviceService';

interface ServiceFormModalProps {
  visible: boolean;
  initialValues?: Service | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void> | void;
}

const EMPTY_FORM: ServiceFormValues = {
  name: '',
  category: '',
  price: '',
  duration: '',
  rating: '',
  description: '',
  whatsIncludedText: '',
};

export default function ServiceFormModal({
  visible,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ServiceFormModalProps): React.JSX.Element {
  const [values, setValues] = useState<ServiceFormValues>(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setValues({
      name: initialValues?.name ?? '',
      category: initialValues?.category ?? '',
      price: initialValues?.price ?? '',
      duration: initialValues?.duration ?? '',
      rating: initialValues?.rating ?? '',
      description: initialValues?.description ?? '',
      whatsIncludedText: initialValues?.whatsIncluded.join('\n') ?? '',
    });
    setValidationError(null);
  }, [initialValues, visible]);

  const title = initialValues ? 'Edit Service' : 'Add Service';

  const canSubmit = useMemo(() => {
    return (
      values.name.trim().length > 0 &&
      values.category.trim().length > 0 &&
      values.price.trim().length > 0 &&
      values.duration.trim().length > 0 &&
      values.rating.trim().length > 0 &&
      values.description.trim().length > 0 &&
      values.whatsIncludedText.trim().length > 0
    );
  }, [values]);

  const updateField = (key: keyof ServiceFormValues, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setValidationError('Please complete all service fields.');
      return;
    }

    setValidationError(null);

    await onSubmit({
      name: values.name.trim(),
      category: values.category.trim(),
      price: values.price.trim(),
      duration: values.duration.trim(),
      rating: values.rating.trim(),
      description: values.description.trim(),
      whatsIncludedText: values.whatsIncludedText.trim(),
    });
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity
              accessibilityLabel="Close service form"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons color="#64748B" name="close" size={22} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Executive Haircut"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={values.name}
            />

            <Text style={styles.label}>Category</Text>
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={(text) => updateField('category', text)}
              placeholder="Haircut"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={values.category}
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
              onChangeText={(text) => updateField('price', text)}
              placeholder="Rs 499"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={values.price}
            />

            <Text style={styles.label}>Duration</Text>
            <TextInput
              onChangeText={(text) => updateField('duration', text)}
              placeholder="45 min"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={values.duration}
            />

            <Text style={styles.label}>Rating</Text>
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={(text) => updateField('rating', text)}
              placeholder="4.8"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={values.rating}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              multiline
              onChangeText={(text) => updateField('description', text)}
              placeholder="Short service description"
              placeholderTextColor="#94A3B8"
              style={[styles.input, styles.descriptionInput]}
              textAlignVertical="top"
              value={values.description}
            />

            <Text style={styles.label}>What's Included</Text>
            <TextInput
              multiline
              onChangeText={(text) => updateField('whatsIncludedText', text)}
              placeholder="One included item per line"
              placeholderTextColor="#94A3B8"
              style={[styles.input, styles.includedInput]}
              textAlignVertical="top"
              value={values.whatsIncludedText}
            />

            {validationError ? (
              <Text style={styles.validationError}>{validationError}</Text>
            ) : null}

            <TouchableOpacity
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                (isSubmitting || !canSubmit) && styles.submitButtonDisabled,
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Saving...' : 'Save Service'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  descriptionInput: {
    minHeight: 96,
  },
  includedInput: {
    minHeight: 112,
  },
  validationError: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 50,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
