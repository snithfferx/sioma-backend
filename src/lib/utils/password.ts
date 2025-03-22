export const hashPassword = async (password: string): Promise<string> => {
    const passwordHashed = await Bun.password.hash(password);
    return passwordHashed;
};

export const verifyPassword = async (
    password: string,
    passwordHashed: string
): Promise<boolean> => {
    const isPasswordCorrect = await Bun.password.verify(password, passwordHashed);
    return isPasswordCorrect;
};