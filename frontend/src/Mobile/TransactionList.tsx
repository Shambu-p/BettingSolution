import React from "react";
import AddIcon from '@mui/icons-material/Add';


const TransactionList = (props: any) => {

    return (
        <div className="h-100" style={{overflow: "hidden auto"}}>
            <div className="container mt-3 pb-1">

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Premium Quality Headphones</h6>
                            <p className="text-muted mb-0">100 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-3 border-0">
                    <div className="card-body d-flex align-items-center">
                        <i className="bx bx-package fs-1 text-success bg-light p-3 rounded"></i>
                        <div className="ms-3 flex-grow-1">
                            <small className="text-muted">PRD#ID1234</small>
                            <h6 className="mb-1">Organic Green Tea Bags</h6>
                            <p className="text-muted mb-0">75 units</p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="btn zbtn rounded-circle px-3 py-3 me-4 mb-5 shadow" style={{position: "absolute", bottom: 80, right: 0}}>
                <AddIcon sx={{fontSize: 25}} />
            </button>
        </div>
    );
};

export default TransactionList;