import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { PremiumButton } from '../components/PremiumButton';
import { SectionHeader } from '../components/SectionHeader';
import { carService } from '../services/carService';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCar'>;

interface FormState {
  name: string;
  brand: string;
  year: string;
  price: string;
  engine: string;
  acceleration: string;
  description: string;
  imageUrl: string;
}

const empty: FormState = {
  name: '',
  brand: '',
  year: '',
  price: '',
  engine: '',
  acceleration: '',
  description: '',
  imageUrl: '',
};

export function AddCarScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const required: (keyof FormState)[] = [
      'name', 'brand', 'year', 'price', 'engine', 'acceleration', 'description',
    ];
    const newErrors: Partial<FormState> = {};
    for (const field of required) {
      if (!form[field].trim()) newErrors[field] = 'Campo obrigatório';
    }
    if (form.year && isNaN(Number(form.year))) newErrors.year = 'Ano inválido';
    if (form.price && isNaN(Number(form.price))) newErrors.price = 'Preço inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    await carService.addCar({
      name: form.name.trim(),
      brand: form.brand.trim(),
      year: Number(form.year),
      price: Number(form.price),
      engine: form.engine.trim(),
      acceleration: form.acceleration.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
      status: 'available',
    });
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Voltar</Text>
          </TouchableOpacity>
          <SectionHeader title="Adicionar veículo" />
        </View>

        <ScrollView contentContainerStyle={styles.form}>
          <Field
            label="Nome do veículo *"
            value={form.name}
            onChange={(v) => set('name', v)}
            error={errors.name}
            placeholder="Ex: Aventador LP780-4"
          />
          <Field
            label="Marca *"
            value={form.brand}
            onChange={(v) => set('brand', v)}
            error={errors.brand}
            placeholder="Ex: Lamborghini"
          />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field
                label="Ano *"
                value={form.year}
                onChange={(v) => set('year', v)}
                error={errors.year}
                placeholder="2024"
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: theme.spacing.md }} />
            <View style={{ flex: 1.5 }}>
              <Field
                label="Preço (R$) *"
                value={form.price}
                onChange={(v) => set('price', v)}
                error={errors.price}
                placeholder="1500000"
                keyboardType="numeric"
              />
            </View>
          </View>
          <Field
            label="Motor *"
            value={form.engine}
            onChange={(v) => set('engine', v)}
            error={errors.engine}
            placeholder="Ex: V8 4.0L Twin-Turbo"
          />
          <Field
            label="Aceleração *"
            value={form.acceleration}
            onChange={(v) => set('acceleration', v)}
            error={errors.acceleration}
            placeholder="Ex: 3.2s 0-100km/h"
          />
          <Field
            label="Descrição *"
            value={form.description}
            onChange={(v) => set('description', v)}
            error={errors.description}
            placeholder="Descreva o veículo..."
            multiline
          />
          <Field
            label="URL da imagem (opcional)"
            value={form.imageUrl}
            onChange={(v) => set('imageUrl', v)}
            placeholder="https://..."
            keyboardType="url"
          />

          <PremiumButton
            label="Salvar veículo"
            onPress={handleSave}
            style={{ marginTop: theme.spacing.md }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'url' | 'email-address';
}

function Field({ label, value, onChange, placeholder, error, multiline, keyboardType }: FieldProps) {
  const { theme } = useTheme();
  const fieldStyles = createFieldStyles(theme);

  return (
    <View style={fieldStyles.container}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline ? fieldStyles.multiline : null, error ? fieldStyles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        multiline={multiline}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
      />
      {error ? <Text style={fieldStyles.error}>{error}</Text> : null}
    </View>
  );
}

function createFieldStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginBottom: 6,
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.font.md,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    multiline: {
      minHeight: 90,
      textAlignVertical: 'top',
    },
    error: {
      color: theme.colors.danger,
      fontSize: 11,
      marginTop: 4,
    },
  });
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    back: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    form: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl * 2,
    },
    row: {
      flexDirection: 'row',
    },
  });
}
