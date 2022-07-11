import { Container, Card, Button, Input, Text } from "@nextui-org/react";
import React from 'react';
import { useForm } from "react-hook-form";
import { FAUCET_SERVER, AMOUNT_GIVEN, DENOM } from '../constants/constants'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Faucet() {

  const [ loading, setLoading ] = React.useState(false);

  const { register, handleSubmit, formState: { errors, dirtyFields } } = useForm({
    mode: "onChange",
    defaultValues: {
      address: ""
    }
  });

  const onSubmit = data => {
    setLoading(true);

    const faucetPromise = new Promise((resolve) =>
      axios.get(`${FAUCET_SERVER}/faucet?address=${data.address}`)
        .then((response) => setTimeout(() => resolve(response), 3000))
        .catch((err) => {
          console.error("Faucet failed", err);
          toast.error(`Faucet error: ${err.message}`);
       })
    );

    const successMessage = `Successfully transferred ${AMOUNT_GIVEN} ${ DENOM }`;
    toast.promise(faucetPromise, {
      pending: 'Faucet request pending',
      success: successMessage,
      error: "error",
    });

    setLoading(false);
  }

  return (
    <Container className="faucet">
        <Text color="white">Use this faucet to get tokens for your private testnet</Text>
        <Card className="faucetCard">
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card.Body>
              <label color="white" aria-label="SCRT Address" htmlFor="address">Please enter your SCRT wallet address: </label>
                <Input
                  {...register("address", {
                    required: "required",
                    minLength: 45,
                    maxLength: {
                      value: 45,
                      message: "Invalid address"
                    },
                    pattern: {
                      value: /^(secret)1[a-z0-9]{38}/i,
                      message: "Invalid address"
                    }
                  })}
                  id="address"
                  name="address"
                  type="text"
                   aria-label="address"
                  autoComplete="off"
                  placeholder="secret1234567"
                  className={`input w-full ${
                    !errors.address && dirtyFields.address && "!bg-green-50"
                  }`}
                />
                <span className="error">{errors.address?.message}</span>
              </Card.Body>
              <Card.Footer>
                <Button disabled={errors.address || loading}
                 style={{ display: "block" }} aria-label="Submit" type="submit">Send me tokens</Button>
              </Card.Footer>
              </form>
        </Card>

        <div>
          <ToastContainer
            position="top-right"
            hideProgressBar={false}
            autoClose={5000}
            newestOnTop={true}
            closeOnClick={false}
            draggable={false}
            rtl={false}
          />
        </div>
    </Container>
  );
}