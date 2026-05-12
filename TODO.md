# TODO - Corrigir CRUD Veículos (Supabase)

- [ ] Atualizar `src/services/veiculoService.ts`
  - [ ] `atualizarVeiculo`: garantir PATCH em `/cars?id=eq.${id}` com `payload` mapeado pt->en; não enviar `id` nem `created_at`; logs pedidos; retorno do objeto atualizado (via `Prefer: return=representation`).
  - [ ] `atualizarStatusVeiculo`: reutilizar `atualizarVeiculo`.
  - [ ] `excluirVeiculo`: garantir DELETE em `/cars?id=eq.${id}` com logs pedidos; remover do cache local; retorno boolean confiável.

- [ ] Ajustar tipagem em `src/screens/AddCarScreen.tsx`
  - [ ] Remover `as any` do `route.params` (quando necessário) sem mudar UI.

- [ ] Verificar `src/screens/CarDetailsScreen.tsx`
  - [ ] Garantir que após ações (reservar/excluir/editar) a tela reflita o novo estado (já recarrega em focus; sem refatorar UI).

- [ ] Rodar verificação local (build/lint/typecheck se existir) e confirmar que TS compila.
