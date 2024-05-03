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
          <div>
            Set details about your NFT
          </div>

          <div className="text-left">
            <div className="form-group ">
              <div className="mt-1 mb-1">Name</div>
              <input type="text" placeholder="Name" name="nftName"/>

            </div>
            <div className="form-group">
              <div className="mt-1 mb-1">Description</div>
              <textarea placeholder="Description" name="nftDescription"/>
            </div>

            <div>
              <div className="mb-1 font-bold">
                Set the creator allocation
              </div>

              <div className="form-group">
                <div className="mt-1 mb-1">Creator Allocation (Max 500 tokens)</div>
                <input type="number" placeholder="Creator Allocation" name="creatorAllocation"/>
                
              </div>
            </div>

       
          </div>

        </div>

        <CommonButton>
          Publish
        </CommonButton>
      </form>
    </div>
  )

}