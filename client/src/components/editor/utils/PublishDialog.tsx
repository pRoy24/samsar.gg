import React from "react";
import CommonButton from "../../common/CommonButton.tsx";

export default function PublishDialog(props) {
  const { onSubmit, selectedChain, setSelectedChain, chainList } = props;

  const onFormSubmit = (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    onSubmit(formData);
  }
  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <div >
          <div className="font-bold">
            Publication NFT details
          </div>

          <div className="text-left">
            <div className="form-group ">
              <div className="mt-1 mb-1">Name</div>
              <input type="text" placeholder="Name" name="nftName" className="w-full h-[40px] pl-2 pr-2 pt-1 pb-1" />

            </div>
            <div className="form-group">
              <div className="mt-1 mb-1">Description</div>
              <textarea placeholder="Description" name="nftDescription" className="w-full h-[40px] pl-2 pr-2 pt-1 pb-1" />
            </div>

            <div>
              <div className="mb-1 font-bold">
                Set the creator allocation
              </div>

              <div className="form-group">
                <div className="mt-1 mb-1">Creator Allocation (Max 500 tokens)</div>
                <input type="number" placeholder="Creator Allocation"
                  name="creatorAllocation" className="w-full h-[40px] pl-2 pr-2 pt-1 pb-1" />

              </div>
            </div>


          </div>
        </div>

        <div className="mt-4">
          <CommonButton>
            Publish
          </CommonButton>
        </div>
      </form>
    </div>
  )

}