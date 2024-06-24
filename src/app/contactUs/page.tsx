"use client";
import React from "react";
import "./contact.css";
import { EnvelopeIcon, PhoneIcon} from '@heroicons/react/24/outline';

export default function Contact (){

    return (
        <div className="container">
            <h1 className="contactHeading">We&apos;d love to hear from you!</h1>
            <div className="content">
			<p className="contactMessage">At Formatics, we prioritize our customers&apos; experience. Our goal is to provide software that not only enhances your business efficiency but also makes your life easier. We value your feedback and constructive criticism. If there is anything we can do to improve your user experience, or if you would simply like to say hello, please feel free to reach out. 
				We believe in continuous improvement and your insights help us to constantly evolve. Whether you have a suggestion for a new feature, encountered a bug, or have a question about how to get the most out of our software, our dedicated support team is here to assist you. Your satisfaction is our top priority, and we strive to respond to all inquiries promptly and thoroughly.
				Thank you for choosing Formatics.
			</p>                
				<div className="contactInfo">
                    <div className="outerContact">
                        <div className="contactItem">
                            <EnvelopeIcon className="icon" />
                            <span className="contactText">Formatics@gmail.com</span>
                        </div>
                        <div className="contactItem">
                            <PhoneIcon className="icon" />
                            <span className="contactText">(310) 508 - 5523</span>
                        </div>
                        <div className="contactItem">
                            <PhoneIcon className="icon" />
                            <span className="contactText">(310) 989 - 0722</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
