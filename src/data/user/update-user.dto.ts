export interface UpdateUserDto {
  name: string;
  picture?: LocalFile;
}

declare global {
  interface LocalFile {
    uri: string;
    name: string;
    type: string;
  }
  interface FormData {
    append(name: string, value: LocalFile): void;
  }
}
