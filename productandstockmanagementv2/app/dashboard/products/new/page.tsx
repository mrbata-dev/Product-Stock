'use client'
import HeaderContent from "@/components/ui/custom/HeaderContent";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store } from "lucide-react";
import React from "react";
import MultipleImageUpload from "@/components/ui/custom/MultipleImageUpload";
import CategoryDropdownSelector from "@/components/ui/custom/products/CategorySelector";
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button";


type Inputs = {
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: string;
  sizes: string[];  
  gender: "male" | "female" | "unisex"; 
  images: File[];
  categoryIds: number[];
  warranty: string;
  returnPolicy: string;
shipping: string;
brand: string;

};

const AddNewProducts = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState:{errors}
    } = useForm<Inputs>()

    const onSubmit : SubmitHandler<Inputs> = (data) => {
        console.log(data);
        
    }

    console.log(watch());
    
  return (
    <div className="container mx-auto py-8">
      <header className="flex items-center  gap-4">
        <span>
          <Store size={30} />
        </span>{" "}
        <HeaderContent title="Add New Product" />
      </header>

      <main>
        <form className="flex justify-between gap-6 lg:gap-8"
        onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex-1">
            {/* Information */}
            <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
              <h1 className="text-xl font-semibold pb-8 md:pb-12">
                General Information
              </h1>
              {/* general information */}
              <div>
                <Label className="text-md pb-2 font-semibold">
                  Name Product
                </Label>
                <input
                {...register("title", { required: true })}
                name="title" type="text" placeholder="Title" />
              </div>
              {/* descriptions */}
              <div className="mt-4">
                <Label className="text-md pb-2 font-semibold">
                  Descriptions Product
                </Label>
                <Textarea
                {...register("description", { required: true })}
                  name="description"
                  className=" border-0 outline-0 focus:outline-0 focus:border-0 focus:ring-0 bg-[#EFEFEF]"
                  placeholder="Write the descriptions about the products..."
                />
              </div>

              {/* Size */}
              <div className="flex items-center  justify-between gap-8">
        <div className="mt-4">
  <Label className="text-md pb-1 font-semibold">Size </Label>
  <p className="text-sm font-light pb-2 text-gray-600">Pick the available sizes</p>
  <div className="flex gap-4 mt-4">
    {["XS", "SM", "M", "XL", "XXL"].map((size) => (
      <label
        key={size}
        className="cursor-pointer"
      >
        <input
          type="checkbox"
          value={size}
          {...register("sizes")}
          className="peer hidden"
        />
        <span className="px-6 py-4 rounded-xl font-semibold bg-[#EFEFEF] shadow-sm peer-checked:bg-black peer-checked:text-white">
          {size}
        </span>
      </label>
    ))}
  </div>
</div>



                <div className="mt-4">
                  <Label className="text-md pb-1 font-semibold">Gender </Label>
                  <p className="text-sm font-light pb-2 text-gray-600 ">
                    Pick the available size
                  </p>
                  <RadioGroup
  defaultValue="male"
  {...register("gender")}
  className="flex"
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="male" id="male" />
    <Label htmlFor="male">Male</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="female" id="female" />
    <Label htmlFor="female">Female</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="unisex" id="unisex" />
    <Label htmlFor="unisex">Unisex</Label>
  </div>
</RadioGroup>
                </div>
              </div>
            </div>

            {/* price and stock */}
            <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
              <h1 className="text-xl font-semibold pb-8 md:pb-12">
                Price and Stock
              </h1>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-md pb-2 font-semibold">
                    Base Price{" "}
                  </Label>
                  <input 
                  {...register("price", { required: true })}
                  name="price" type="number" placeholder="0" />
                </div>
                <div>
                  <Label className="text-md pb-2 font-semibold">Stock</Label>
                  <input
                  {...register("stock", { required: true })}
                  name="stock" type="number" placeholder="0" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <div>
                  <Label className="text-md pb-2 font-semibold">
                    Discount{" "}
                  </Label>
                  <input 
                  {...register("discount", { required: true })}
                  name="discount" type="number" placeholder="0" />
                </div>
                <div>
                  <Label className="text-md pb-2 font-semibold">Brand</Label>
                  <input 
                  {...register("brand", { required: true })}
                  name="brand" type="text" placeholder="Brand name" />
                </div>
              </div>
            </div>

            {/* warranty */}
            <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
              <h1 className="text-xl font-semibold pb-8 md:pb-12">
                Warranty and Shipping
              </h1>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-md pb-2 font-semibold">
                    Warranty{" "}
                  </Label>
                  <input
                  {...register("warranty", { required: true })}
                  name="warranty" type="text" placeholder="Warranty" />
                </div>
                <div>
                  <Label className="text-md pb-2 font-semibold">Shipping</Label>
                  <input 
                  {...register("shipping", { required: true })}
                  name="shipping" type="text" placeholder="Shipping" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <div>
                  <Label className="text-md pb-2 font-semibold">
                    Return policy{" "}
                  </Label>
                  <input
                  {...register("returnPolicy", { required: true })}
                    name="return"
                    type="text"
                    placeholder="Return Policy"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* images */}
          <div className="">
           <div className="gap-8 flex"> 
            <Button type="reset"
            className="hover:border-2 border-green-400 font-semibold cursor-pointer hover:border-green-600"
            >Cancel</Button>
            <Button type="submit"
                className="bg-green-400 text-white font-semibold cursor-pointer hover:bg-green-600"
            >Add Products</Button></div>
            {/* images */}
            <div>
              <div className="">
                <h1 className="text-xl font-semibold py-6">
                  Upload Image
                </h1>
                <div>
                    <MultipleImageUpload onChange={(files) => setValue("images", files)}/>
                </div>

                <div>
                    <CategoryDropdownSelector onChange={(categories) => setValue('categoryIds', categories)} />

                </div>
              </div>
            </div>

         
          </div>
          
        </form>
      </main>
    </div>
  );
};

export default AddNewProducts;
