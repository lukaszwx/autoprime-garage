import React, { useEffect, useMemo, useState } from 'react';
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
  useWindowDimensions,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PremiumButton } from '../components/PremiumButton';
import { SectionHeader } from '../components/SectionHeader';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/navigationTypes';
import { veiculoService } from '../services/veiculoService';
import { AppTheme } from '../styles/theme';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddCar' | 'EditCar'
>;

interface FormState {
  nome: string;
  marca: string;
  ano: string;
  preco: string;
  motor: string;
  aceleracao: string;
  descricao: string;
  imagem: string;
}

const fallbackImage =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80';

const empty: FormState = {
  nome: '',
  marca: '',
  ano: '',
  preco: '',
  motor: '',
  aceleracao: '',
  descricao: '',
  imagem: '',
};

export function AddCarScreen({
  route,
  navigation,
}: Props) {
  const { theme } = useTheme();

  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  const styles = createStyles(theme, isCompact);

  const params = route.params;

  const carId =
    params && 'carId' in params
      ? params.carId
      : undefined;

  const isEdit = !!carId;

  const [form, setForm] =
    useState<FormState>(empty);

  const [errors, setErrors] =
    useState<Partial<FormState>>({});

  const [loadingInitial, setLoadingInitial] =
    useState(isEdit);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    if (!carId) return;

    async function loadVehicle() {
      try {
        const v =
          await veiculoService.obterVeiculoPorId(
            carId
          );

        if (v) {
          setForm({
            nome: v.nome,
            marca: v.marca,
            ano: String(v.ano),
            preco: String(v.preco),
            motor: v.motor,
            aceleracao: v.aceleracao,
            descricao: v.descricao,
            imagem: v.imagem ?? '',
          });
        }
      } finally {
        setLoadingInitial(false);
      }
    }

    loadVehicle();
  }, [carId]);

  function setField(
    field: keyof FormState,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  }

  function validate(): boolean {
    const required: (keyof FormState)[] = [
      'nome',
      'marca',
      'ano',
      'preco',
      'motor',
      'aceleracao',
      'descricao',
    ];

    const newErrors: Partial<FormState> = {};

    for (const field of required) {
      if (!form[field].trim()) {
        newErrors[field] =
          'Campo obrigatório';
      }
    }

    if (
      form.ano &&
      (isNaN(Number(form.ano)) ||
        Number(form.ano) < 1900)
    ) {
      newErrors.ano = 'Ano inválido';
    }

    if (
      form.preco &&
      (isNaN(Number(form.preco)) ||
        Number(form.preco) <= 0)
    ) {
      newErrors.preco = 'Preço inválido';
    }

    if (
      form.imagem &&
      !/^https?:\/\//i.test(form.imagem)
    ) {
      newErrors.imagem =
        'URL da imagem inválida';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const formattedPrice = useMemo(() => {
    const value = Number(form.preco);

    if (isNaN(value) || value <= 0) {
      return 'R$ 0';
    }

    return new Intl.NumberFormat(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
      }
    ).format(value);
  }, [form.preco]);

  async function handleSave() {
    if (isSaving) return;

    if (!validate()) {
      Alert.alert(
        'Campos inválidos',
        'Revise os campos destacados.'
      );

      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        nome: form.nome.trim(),
        marca: form.marca.trim(),
        ano: Number(form.ano),
        preco: Number(form.preco),
        motor: form.motor.trim(),
        aceleracao:
          form.aceleracao.trim(),
        descricao:
          form.descricao.trim(),
        imagem:
          form.imagem.trim() ||
          undefined,
        status: 'available' as const,
      };

      if (isEdit && carId) {
        await veiculoService.atualizarVeiculo(
          carId,
          payload
        );
      } else {
        await veiculoService.adicionarVeiculo(
          payload
        );
      }

      Alert.alert(
        isEdit
          ? 'Veículo atualizado'
          : 'Veículo adicionado',
        isEdit
          ? 'As alterações foram salvas com sucesso.'
          : 'O veículo foi cadastrado no acervo.'
      );

      navigation.goBack();
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível salvar o veículo.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (loadingInitial) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          color={theme.colors.primary}
        />

        <Text style={styles.loadingText}>
          Carregando veículo...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text style={styles.back}>
              ← Voltar
            </Text>
          </TouchableOpacity>

          <SectionHeader
            title={
              isEdit
                ? 'Editar veículo'
                : 'Adicionar veículo'
            }
            subtitle={
              isEdit
                ? 'Atualize as informações do veículo.'
                : 'Cadastre um novo veículo premium.'
            }
          />
        </View>

        <ScrollView
          contentContainerStyle={
            styles.form
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.previewCard}>
            <Image
              source={{
                uri:
                  form.imagem ||
                  fallbackImage,
              }}
              style={styles.previewImage}
            />

            <View style={styles.previewOverlay}>
              <Text style={styles.previewBrand}>
                {form.marca || 'Marca'}
              </Text>

              <Text style={styles.previewTitle}>
                {form.nome ||
                  'Nome do veículo'}
              </Text>

              <Text style={styles.previewPrice}>
                {formattedPrice}
              </Text>
            </View>
          </View>

          <Field
            label="Nome do veículo *"
            value={form.nome}
            onChange={(v) =>
              setField('nome', v)
            }
            error={errors.nome}
            placeholder="Ex: Aventador LP780-4"
          />

          <Field
            label="Marca *"
            value={form.marca}
            onChange={(v) =>
              setField('marca', v)
            }
            error={errors.marca}
            placeholder="Ex: Lamborghini"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field
                label="Ano *"
                value={form.ano}
                onChange={(v) =>
                  setField('ano', v)
                }
                error={errors.ano}
                placeholder="2024"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.rowSpacer} />

            <View style={{ flex: 1.5 }}>
              <Field
                label="Preço (R$) *"
                value={form.preco}
                onChange={(v) =>
                  setField('preco', v)
                }
                error={errors.preco}
                placeholder="1500000"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Field
            label="Motor *"
            value={form.motor}
            onChange={(v) =>
              setField('motor', v)
            }
            error={errors.motor}
            placeholder="Ex: V8 4.0L Twin-Turbo"
          />

          <Field
            label="Aceleração *"
            value={form.aceleracao}
            onChange={(v) =>
              setField(
                'aceleracao',
                v
              )
            }
            error={errors.aceleracao}
            placeholder="Ex: 3.2s 0-100km/h"
          />

          <Field
            label="Descrição *"
            value={form.descricao}
            onChange={(v) =>
              setField(
                'descricao',
                v
              )
            }
            error={errors.descricao}
            placeholder="Descreva o veículo..."
            multiline
          />

          <Field
            label="URL da imagem"
            value={form.imagem}
            onChange={(v) =>
              setField('imagem', v)
            }
            error={errors.imagem}
            placeholder="https://..."
            keyboardType="url"
          />

          {isSaving ? (
            <View
              style={styles.loadingButton}
            >
              <ActivityIndicator
                color={
                  theme.colors.background
                }
              />

              <Text
                style={
                  styles.loadingButtonText
                }
              >
                Salvando veículo...
              </Text>
            </View>
          ) : (
            <PremiumButton
              label={
                isEdit
                  ? 'Salvar alterações'
                  : 'Salvar veículo'
              }
              onPress={handleSave}
              style={{
                marginTop:
                  theme.spacing.md,
              }}
            />
          )}
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
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'url'
    | 'email-address';
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
 multiline,
  keyboardType,
}: FieldProps) {
  const { theme } = useTheme();

  const styles =
    createFieldStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          multiline &&
            styles.multiline,
          error &&
            styles.inputError,
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={
          theme.colors.muted
        }
        multiline={multiline}
        keyboardType={
          keyboardType ??
          'default'
        }
        autoCapitalize="none"
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function createFieldStyles(
  theme: AppTheme
) {
  return StyleSheet.create({
    container: {
      marginBottom:
        theme.spacing.md,
    },

    label: {
      fontSize: theme.font.sm,
      color: theme.colors.muted,
      marginBottom: 8,
      fontWeight: '700',
    },

    input: {
      backgroundColor:
        theme.colors.surface,
      borderWidth: 1,
      borderColor:
        theme.colors.border,
      borderRadius:
        theme.radius.md,
      padding: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.font.md,
    },

    inputError: {
      borderColor:
        theme.colors.danger,
    },

    multiline: {
      minHeight: 110,
      textAlignVertical: 'top',
    },

    error: {
      color: theme.colors.danger,
      fontSize: 12,
      marginTop: 6,
      fontWeight: '700',
    },
  });
}

function createStyles(
  theme: AppTheme,
  isCompact: boolean
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
    },

    loadingContainer: {
      flex: 1,
      backgroundColor:
        theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },

    loadingText: {
      color: theme.colors.muted,
      fontSize: theme.font.sm,
      fontWeight: '700',
    },

    header: {
      padding: isCompact
        ? theme.spacing.sm
        : theme.spacing.md,
      gap: theme.spacing.sm,
    },

    back: {
      color: theme.colors.primary,
      fontSize: theme.font.md,
      fontWeight: '700',
      marginBottom:
        theme.spacing.sm,
    },

    form: {
      padding: isCompact
        ? theme.spacing.sm
        : theme.spacing.md,
      paddingBottom:
        theme.spacing.xl * 2,
    },

    previewCard: {
      height: 240,
      borderRadius:
        theme.radius.lg,
      overflow: 'hidden',
      marginBottom:
        theme.spacing.lg,
      backgroundColor:
        theme.colors.surface,
    },

    previewImage: {
      width: '100%',
      height: '100%',
    },

    previewOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
      padding: theme.spacing.lg,
    },

    previewBrand: {
      color: '#ffffffcc',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 2,
      marginBottom: 6,
    },

    previewTitle: {
      color: '#ffffff',
      fontSize: 28,
      fontWeight: '900',
      letterSpacing: -0.5,
    },

    previewPrice: {
      color: theme.colors.primary,
      fontSize: 22,
      fontWeight: '900',
      marginTop: 6,
    },

    row: {
      flexDirection: isCompact
        ? 'column'
        : 'row',
    },

    rowSpacer: {
      width: isCompact
        ? 0
        : theme.spacing.md,
      height: isCompact
        ? theme.spacing.md
        : 0,
    },

    loadingButton: {
      minHeight: 54,
      borderRadius:
        theme.radius.md,
      backgroundColor:
        theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },

    loadingButtonText: {
      color:
        theme.colors.background,
      fontSize: theme.font.md,
      fontWeight: '900',
    },
  });
}