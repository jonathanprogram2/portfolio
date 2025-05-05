export function Button({ children, className }) {
    return (
        <button className={`px-4 py-2 rounded-lg font-semibold transition ${className || ""}`}>
            {children}
        </button>
    );
}