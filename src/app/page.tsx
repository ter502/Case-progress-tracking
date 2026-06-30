export default function LandPage() {
  return (
      <div> 
        <header>
          
        </header>

        <main >
          <form className="flex flex-col flex-wrap items-center justify-center w-screen h-screen gap-12">
            <a href="/ "><img src="/assets/dhsc.png" alt="logo" className="w-96"></img></a>
            <h1 className="text-5xl font-tw-kai font-bold">案件追蹤系統</h1>

            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-1">
                <label className="text-2xl font-tw-kai w-32" >帳戶名稱</label>
                <input className="border-2 border-gray-700 focus:border-pink-600 rounded-sm px-2"></input>
              </div>

              <div className="flex flex-row gap-1">
                <label className="text-2xl font-tw-kai w-32" >密碼</label>
                <input className="border-2 border-gray-700 focus:border-pink-600 rounded-sm px-2"></input>
              </div>

            </div>

            <div className="flex flex-row justify-center gap-12 w-92 h-8">
              <button type="submit" className="bg-orange-300  rounded-sm hover:bg-orange-400 w-32">忘記密碼</button>
              <button type="submit" className="bg-green-300  rounded-sm hover:bg-green-400 w-32">登入</button>
            </div>

          </form>
        </main>

        <footer>

        </footer>
      </div>
  );
}
