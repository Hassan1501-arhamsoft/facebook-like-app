function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-5">
      <div className="w-full max-w-[450px] rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-[28px] text-gray-900 m-0">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-gray-500 text-[15px]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;