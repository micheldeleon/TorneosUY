interface Props {
    text: string
}
export const GoogleButton = ({ text }: Props) => {

    return (
        < div className="flex justify-center mt-4" >
            <button className="border border-[#d9d9f3] text-white font-semibold px-3 py-1 rounded-md">
                {text}
            </button>
        </div >
    )

}
