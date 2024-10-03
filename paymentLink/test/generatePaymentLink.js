const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

chai.should();
chai.use(chaiHttp);

describe('Here We are testing api responesible for all listing payment links', () => {
 
    // Testing the apis which is responsible for getting total payment list with default pagination 10  
    it('Get All list of payment', (done) => {

        const mockToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE3MDE3NjE1MjMsImlhdCI6MTcwMTY3NTEyMywibmJmIjoxNzAxNjc1MTIzLCJ1c2VySW5mbyI6eyJ1c2VyX2lkIjoiMzAiLCJuYW1lIjoiRGlwYW5qYW4gR2hvc2giLCJlbWFpbCI6ImRpcGFuamFuQGxhd3Npa2hvLmluIiwicGhvbmUiOiI5NDc2MjI5MTkzIiwicm9sZSI6ImFkbWluIiwicm9sZV9jYWxsZXIiOm51bGx9fQ.rO02cjNVA5KBdXqIrbmVX4WRjuRrAHcSaFQx4w-KTQugk3gG8qQVa0TtOZz8kXHJzgVxAruzOaHMAuc7YkXEbpIgyYyLrmaivYO1hB894Ii3bZgPrHUUP9w7-EqXBcyO_elSI_K7B9AWEKFrLDgjp-u_TJ61tFVpeRJJUKC2gDouHTELSNQXhnD2po7kqf_vaKLfjYo9AJ0WJQzez3EHGOmvdXxs60lzvg1NqQAPdxz_3gkVk8U7brwjGF9RtssEDsnJT5IJOxi359a0AjSUhd8Je23KCjicUiohqbM-iHo9xoU7RXjB2thP5NFQUaCQ-jZCyM4Z7-dlH7avXX8uGNh4ApAGpqu3yW4Wy9a7A9jW-wAKTuwiii89LsN94utLFzMgJw6aaOwZEQS9aRVIJw4qx7_01QDA8G6FpLLA2eH0q5cS2F2BE88-B3GZyvf2qGkNeJSq4MYQWL8X7fuPgMLa6Gh2Er7eb1i62cGdJGJQF3H7Lm7RF7e1RuK7nBwCpBMcu7F0Dgsb1ogsr9ih_KUD2eE6AfT2Za7iLlqZL3qaAA2lQxzYfMAl64lUSDfFAHBbpQECnYuTJj3ElnDD4ZTs57hEKyiRQwTt9jcqUGNATjtngulHw_b33TYMSefl8Od3_c5gw3lJSONlsKadzoAYP9O4Bnpe5tjOZz5VPfE';

        chai
        .request(app)
        .get('/api/v1/paymentLink/')
        .set('authorization', mockToken)
        .end((err, res) => {
            if (err) {
                console.log("err==",err);
                done();
            } else {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('docs')
                done();
            }
            
        });
    }); // End it('Get All list of payment', (done) => {

    


    


   
 
});