interface LogoProps {
    text: string;
}

export const Logo = ({ text }: LogoProps) => (
    <div className="flex h-14 items-center justify-center rounded-lg bg-white shadow-sm border border-black/5">
        <span className="text-xl font-black tracking-wide text-slate-800">{text}</span>
    </div>
);
