import { useZorm } from "react-zorm";
import toast from "react-simple-toasts";
import { useNavigate } from "react-router-dom";
import { Card } from "../Card";
import { TextArea } from "../TextArea";
import { ErrorMessage } from "../ErrorMessage";
import { Button } from "../Button";
import { Title } from "../Title";
import { createPostSchema } from "../../createPost.schema";
import { createPost } from "../../api/createPost";
import { useGlobalStore } from "../../useGlobalStore";
import { FiLoader } from "react-icons/fi";

const texts = {
  createPostSuccess: "O post foi criado com sucesso!",
  createPostFailure: "Houve um erro ao criar o seu post. :(",
  contentPlaceholder: "No que você está pensando?",
  submitButtonLabel: "Criar publicação",
};

type CreatePostCardProps = {
  onSubmitSuccess: () => void;
};

export function CreatePostCard({ onSubmitSuccess }: CreatePostCardProps) {
  const navigate = useNavigate();
  const isLoading = useGlobalStore((state) => state.isLoading);
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const zo = useZorm("create-post", createPostSchema, {
    async onValidSubmit(event) {
      event.preventDefault();
      const post = event.data;
      setIsLoading(true);
      const response = await createPost(post);
      setIsLoading(false);
      if (response.success) {
        toast(texts.createPostSuccess);
        event.target.reset();
        onSubmitSuccess();
      } else {
        toast(texts.createPostFailure);
      }
    },
  });
  const disabled = zo.validation?.success === false;

  return (
    <Card>
      <form className="flex flex-col gap-2" noValidate ref={zo.ref}>
        <div>
          <TextArea
            placeholder={texts.contentPlaceholder}
            name={zo.fields.message()}
            className={zo.errors.message("border-red-500 focus:border-red-500")}
          />
          {zo.errors.message((error) => (
            <ErrorMessage message={error.message} />
          ))}
        </div>
        <Button disabled={disabled} type="submit">
          {isLoading ? (
            <FiLoader className="text-white animate-spin text-lg inline" />
          ) : (
            texts.submitButtonLabel
          )}
        </Button>
      </form>
    </Card>
  );
}
