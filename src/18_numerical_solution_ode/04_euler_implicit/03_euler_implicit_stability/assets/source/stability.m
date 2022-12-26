lambda=5;
h=1;


V = [];
E = [];

u0=1;
u=u0;
U=[u];


for k = [1:100]
    u=1/(1-h*lambda)*u;

    U = [U,u];
end

plot(U);
