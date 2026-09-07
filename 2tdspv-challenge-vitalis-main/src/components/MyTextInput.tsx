import { useController } from "react-hook-form";
import { Text, TextInput, TextInputProps } from "react-native";

type Props = {
  name: string;
  control: any;
} & TextInputProps;

const MyTextInput = ({ name, control, ...props }: Props) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <>
      <TextInput
        {...props}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
      />
      {error && (
        <Text className="text-red-500 text-xs ml-1">{error.message}</Text>
      )}
    </>
  );
};

export default MyTextInput;