import { FormDemo } from "@/components/form-profile";


export default function ProfilePage() {
  return (
    <div className="bg-[#f5f5f5] flex  p-4">
      <div className="bg-white p-4 rounded-md shadow border w-full ">
       <div className="border-b  ">
         <h1 className="text-xl font-bold mb-4">Thông tin cá nhân</h1>
       </div>
        <FormDemo />
      </div>
      {/* <div className="theme-scaled">
        <FormDemo />
      </div> */}
    </div>
  )
}