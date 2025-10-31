interface Props {
    txt: string; // en minúscula, el tipo primitivo es 'string', no 'String'
}

export const Submit = ({ txt }: Props) => {
    return (
        <button
            type="submit"
            className="mt-4 bg-[#d9d9f3] text-[#1e1e5a] font-semibold py-3 rounded-md hover:bg-[#c8c8ec] transition"
        >
            {txt}
        </button>
    );
};