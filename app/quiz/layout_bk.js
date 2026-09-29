export default function Layout ({children,about}) {
    return(
        <div className="container">
            {children}
            {about}
        </div>
    )
}