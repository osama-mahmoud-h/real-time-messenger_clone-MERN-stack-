import React, { useState, useEffect,Component } from "react";
import axios from "axios";

    export default class Fetcher extends Component {

        constructor(props) {
            super(props);
    
            this.onImgChange = this.onImgChange.bind(this);
            this.onUpload = this.onUpload.bind(this);
    
            this.state = {
                imagesArray: ''
            }
        }
    
        onImgChange(event) {
            this.setState(
                { 
                    imagesArray: [...this.state.imagesArray, ...event.target.files] 
                }
            )
        }
    
        onUpload(event) {
            event.preventDefault()
            let formData = new FormData();
    
            for (const key of Object.keys(this.state.imagesArray)) {
                formData.append('imagesArray', this.state.imagesArray[key])
            }

            const name = (event.target)[1].value;
            const email = (event.target)[2].value;
            //console.log("name: ",name);
           // const categories = ["apple","facebook"];
            formData.append('name', name);
            formData.append('email', email);

            formData.append('categories[]',5);
            formData.append('categories[]',"google");

            axios.post("/api/test", formData, {
            }).then(response => {
                console.log((response.data))
            })
        }
    
        render() {
            return (
                <div>
                    <form onSubmit={this.onUpload}>
    
                        
                        <div className="form-group">
                            <input className="form-control form-control-lg mb-3" type="file" multiple name="imagesArray" onChange={this.onImgChange} />
                        </div>

                        <div className="form-group">
                            <input className="form-control form-control-lg mb-3" type="text"  name="name" />
                        </div>

                        <div className="form-group">
                            <input className="form-control form-control-lg mb-3" type="email"  name="email" />
                        </div>
    
                        <div className="d-grid">
                            <button className="btn btn-danger" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            )
        }
    }