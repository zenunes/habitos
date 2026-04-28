-- Adiciona política RLS permitindo que o usuário insira (insert) seu próprio perfil
-- Isso é necessário para que a operação de upsert() funcione corretamente quando o perfil ainda não existe.

create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);
