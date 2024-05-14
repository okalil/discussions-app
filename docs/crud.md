# CRUD

Operações básicas de criar, listar, editar e deletar.

### Componentes da camada de dados

1. Criação de DTOs para representar os dados transferidos

```tsx
// Representa o modelo dos comentários listados
export interface CommentDto {
  id: string;
  content: string;
  votes: number;
  voted: boolean;
  user: UserDto;
}
```

```tsx
// Representa o modelo dos dados enviados para criar ou editar
export interface SaveCommentDto {
  content: string;
}
```

2. Criação de classe de repositório

```ts
export class CommentRepository {
  private discussionId: string;
  constructor(discussionId: string) {
    this.discussionId = discussionId;
  }

  async getComments(): Promise<CommentDto[]> {
    const response = await api.get(
      `/api/v1/discussions/${this.discussionId}/comments`
    );
    const json = await response.json();
    return json.comments;
  }

  async createComment(dto: SaveCommentDto) {
    const body = JSON.stringify(dto);
    await api.post(`/api/v1/discussions/${this.discussionId}/comments`, {
      body,
    });
  }

  async updateComment(commentId: string, dto: SaveCommentDto) {
    const body = JSON.stringify(dto);
    await api.put(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}`,
      { body }
    );
  }

  async deleteComment(commentId: string) {
    await api.delete(
      `/api/v1/discussions/${this.discussionId}/comments/${commentId}`
    );
  }
}
```

### Componentes da camada de UI

1. Componente para listar

```tsx
export function CommentsList({ discussionId }) {
  const {
    data: comments,
    isLoading,
    isLoadingError,
  } = useQuery({
    queryKey: ['comments', discussionId],
    queryFn: () => new CommentRepository(discussionId).getComments(),
  });

  if (isLoading) {
    // UI de carregamento
  }

  if (isLoadingError) {
    // UI de erro
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={it => it.id}
      renderItem={({ item }) => <Comment comment={comment} />}
    />
  );
}
```

2. Componente de criar e editar

```tsx
function AddEditComment({ discussionId, comment }) {
  const form = useForm({ defaultValues: comment });
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ commentId, data }) => {
      const repository = new CommentRepository(discussionId);
      return commentId
        ? repository.createComment(data)
        : repository.updateComment(commentId, data);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['comments'] }),
  });

  const onSave = form.handleSubmit(data => {
    mutation.mutate(
      { commentId: comment?.id, data },
      { onSuccess: () => form.reset() }
    );
  });

  return (
    <FormProvider {...form}>
      <FormInput name="content" />
      <Button loading={mutation.isPending} onPress={onSave}>
        Salvar
      </Button>
    </FormProvider>
  );
}
```

3. Componente de deletar

```tsx
function DeleteComment({ discussionId, comment }) {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: commentId =>
      new CommentRepository(discussionId).deleteComment(commentId),
    onSuccess: () => client.invalidateQueries({ queryKey: ['comments'] }),
  });

  const onDelete = () => {
    Alert.alert('Excluir comentário', 'Excluir comentário permanentemente?', [
      { text: 'Cancelar' },
      {
        text: 'Ok',
        onPress() {
          requestAnimationFrame(() => {
            deleteCommentMutation.mutate(comment);
          });
        },
      },
    ]);
  };

  return <Button onPress={onDelete}>Deletar</Button>;
}
```
