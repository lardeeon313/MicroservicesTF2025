
const NotFoundPage = () => {

    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-7xl font-semibold text-red-600">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                    Not Found 
                </h1>
                <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    El servidor web no pudo encontrar el recurso que solicitó.
                </p>
            </div>
        </main>
    )

}

export default NotFoundPage;